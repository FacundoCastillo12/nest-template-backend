export type GetAllPaginatedOptions<
  P extends object,
  O extends object = undefined,
  F extends object = undefined,
> = {
  page?: P;
  orderBy?: O;
  filter?: F;
};
