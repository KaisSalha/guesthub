type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type Obj = Record<string, unknown>;

type Prettify<T> = {
	[K in keyof T]: T[K];
} & NonNullable<unknown>;

type ValuesOf<T> = T[keyof T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

export type Unmasked<TFrag, TDepth extends number = 9> = TDepth extends 0
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

type FlattenedRefs<TFrag, TDepth extends number> = TFrag extends {
	" $fragmentRefs"?: infer TFragRefs;
}
	? FlattenedRefs<
			Prettify<
				Omit<TFrag, " $fragmentRefs" | " $fragmentName"> &
					Omit<
						UnionToIntersection<ValuesOf<NonNullable<TFragRefs>>>,
						" $fragmentName"
					>
			>,
			TDepth
		>
	: TFrag;
