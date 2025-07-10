export interface Host {
  id: number;
  address: string;
  port: number;
  password: string | null;
  alias: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
