import { useState, useEffect, useCallback } from "react";
import axios, { Method } from "axios";
import { toast } from "react-toastify";

interface AxiosResponse<T> {
  data: T;
}

const useInfiniteFetch = <T,>(
  url: string,
  method: Method,
  elementsFromEachRequest: number,
  displayToast?: boolean,
  apiWillReturnTotal?: boolean,
  reverse?: boolean
) => {
  const [data, setData] = useState<T[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (reFetch?: boolean) => {
      try {
        let firstPage = 0;
        if (reFetch) {
          setLoading(true);
          setData([]);

          firstPage = 1;
        }

        if (apiWillReturnTotal) {
          const response: AxiosResponse<{ data: T[]; total: number }> =
            await axios({
              method,
              url: `${url}?page=${firstPage || page}`,
            });

          setLoading(false);

          setHasMore(response.data.total > elementsFromEachRequest * page);
          console.log(response.data);

          setTotal(response.data.total);
          setData((prevData) => {
            if (prevData) {
              return reverse
                ? [...response.data.data, ...prevData]
                : [...prevData, ...response.data.data];
            } else {
              setData(response.data.data);
            }
          });
        } else {
          const response: AxiosResponse<T[]> = await axios({
            method,
            url: `${url}?page=${firstPage || page}`,
          });
          setLoading(false);

          setHasMore(response.data.length >= elementsFromEachRequest);
          console.log(response.data);
          setData((prevData) => {
            if (prevData) {
              return [...prevData, ...response.data];
            } else {
              setData(response.data);
            }
          });
        }
      } catch (error) {
        setError(!!error);
        if (displayToast) {
          toast.info(`Something went wrong!`);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      apiWillReturnTotal,
      method,
      url,
      page,
      elementsFromEachRequest,
      reverse,
      displayToast,
    ]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reFetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const fetchMoreData = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  return {
    data,
    total,
    loading,
    error,
    hasMore,
    setData,
    fetchMoreData,
    reFetch,
  };
};

export default useInfiniteFetch;
