type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type Obj = Record<string, unknown>;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

type ValuesOf<T> = T[keyof T];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type FlattenedRefs<TFrag, TDepth extends number> = TDepth extends 0
  ? TFrag
  : TFrag extends { " $fragmentRefs"?: infer TFragRefs }
    ? FlattenedRefs<
        Prettify<
          Omit<TFrag, " $fragmentRefs" | " $fragmentName"> &
            Omit<
              UnionToIntersection<ValuesOf<NonNullable<TFragRefs>>>,
              " $fragmentName"
            >
        >,
        Decr[TDepth]
      >
    : TFrag;

export type Unmasked<TFrag, TDepth extends number = 1> = TDepth extends 0
  ? TFrag
  : FlattenedRefs<TFrag, TDepth> extends infer TFlattened
    ? {
        [TField in keyof TFlattened]: TFlattened[TField] extends
          | Obj
          | null
          | undefined
          ? Unmasked<TFlattened[TField], Decr[TDepth]>
          : TFlattened[TField] extends Array<infer TElement>
            ? Array<Unmasked<TElement, Decr[TDepth]>>
            : TFlattened[TField];
      }
    : never;
