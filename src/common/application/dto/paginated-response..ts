import { ApiProperty } from '@nestjs/swagger';

export interface IPaginated<Entity extends object> {
  data: Entity[];
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  itemCount: number;
}

export class PaginatedResponseDto<T extends object> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  itemCount: number;

  constructor({
    data,
    pageNumber,
    pageSize,
    pageCount,
    itemCount,
  }: IPaginated<T>) {
    this.data = data;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.pageCount = pageCount;
    this.itemCount = itemCount;
  }
}
