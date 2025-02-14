import axios, { AxiosResponse } from "axios";

type updateResourceType = <Res, Req>(
  url: string,
  data: Req,
  token?: string
) => Promise<AxiosResponse<Res>>;

export const updateResource: updateResourceType = async <Res, Req>(
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

    const response: AxiosResponse<Res> = await axios.put(url, data, config);
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
