import { DataTable } from "@guesthub/ui/data-table";
import { DocumentNode, TypedDocumentNode, useQuery } from "@apollo/client";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface Node {
  id: string;
}

type NodeFragment<TNode> = {
  " $fragmentRefs"?: {
    [key: string]: TNode;
  };
};

type Data<TResultKey extends string, TNode> = {
  [key in TResultKey]?: {
    totalCount: number;
    edges: Array<{
      __typename?: string;
      node: { __typename?: string } & NodeFragment<TNode>;
    } | null>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  } | null;
};

type InternalData<TResultKey extends string, TNode> = {
  [key in TResultKey]?: {
    totalCount: number;
    edges: Array<{
      __typename?: string;
      node: TNode | null;
    } | null>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  } | null;
};

interface Variables {
  first?: number | null;
  skip?: number | null;
  orderBy?: string | null;
}

export interface QueryTableProps<
  TResultKey extends string,
  TData extends Data<TResultKey, TNode>,
  TVariables extends Variables,
  TNode extends Node,
> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables: Omit<TVariables, "first" | "offset">;
  resultKey: TResultKey;
  columns: ColumnDef<TNode>[];
  toolBarButtons?: React.ReactNode;
  onChangeTotalCount?(totalCount: number): void;
  onStartLoading?(): void;
  onLoad?(data: InternalData<TResultKey, TNode>[TResultKey]): void;
  onRowClick?(row: TNode): void;
}

export const QueryTable = function <
  TResultKey extends string,
  TData extends Data<TResultKey, TNode>,
  TVariables extends Variables,
  TNode extends Node,
>({
  query,
  variables,
  resultKey,
  columns,
  onStartLoading,
  onChangeTotalCount,
  onLoad,
  toolBarButtons,
  onRowClick,
}: QueryTableProps<TResultKey, TData, TVariables, TNode>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { loading, data } = useQuery<
    InternalData<TResultKey, TNode>,
    TVariables
  >(query, {
    variables: {
      ...(variables as TVariables),
      first: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
    },
    onCompleted: (data) => data[resultKey] && onLoad?.(data[resultKey]),
    notifyOnNetworkStatusChange: true,
  });

  const pageControls = {
    pagination,
    setPagination,
  };

  const totalCount =
    (data && data[resultKey] && data[resultKey]!.totalCount) || 0;

  const pageInfo = (data && data[resultKey] && data[resultKey]!.pageInfo) || {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: "",
    endCursor: "",
  };

  useEffect(
    () => onChangeTotalCount?.(totalCount),
    [onChangeTotalCount, totalCount]
  );

  useEffect(() => {
    if (loading && onStartLoading) {
      onStartLoading();
    }
  }, [onStartLoading, loading]);

  const nodes = data?.[resultKey]?.edges.map((edge) => edge!.node!);

  return (
    <div>
      <DataTable
        loading={loading}
        data={nodes ?? []}
        columns={columns}
        totalCount={totalCount}
        pageInfo={pageInfo}
        pageControls={pageControls}
        toolBarButtons={toolBarButtons}
        onRowClick={onRowClick}
      />
    </div>
  );
};
