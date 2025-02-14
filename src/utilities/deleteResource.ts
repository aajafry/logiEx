import axios, { AxiosResponse } from "axios";

type DeleteResourceType = <Res>(
  url: string,
  token?: string
) => Promise<AxiosResponse<Res>>;

export const deleteResource: DeleteResourceType = async <Res>(
  url: string,
  token?: string
): Promise<AxiosResponse<Res>> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response: AxiosResponse<Res> = await axios.delete(url, config);
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
