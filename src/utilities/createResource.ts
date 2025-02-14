import axios, { AxiosResponse } from "axios";

type CreateResourceType = <Res, Req = unknown>(
  url: string,
  data: Req,
  token?: string
) => Promise<AxiosResponse<Res>>;

export const createResource: CreateResourceType = async <Res, Req>(
  url: string,
  data: Req,
  token?: string
): Promise<AxiosResponse<Res>> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response: AxiosResponse<Res> = await axios.post(url, data, config);
    return response;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred."
    );
  }
};
