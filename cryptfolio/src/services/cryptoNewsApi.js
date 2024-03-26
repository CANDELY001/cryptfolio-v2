import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoNewsHeaders = {
  "X-RapidAPI-Key": "672dfbcd72msh4bb9872cd7a492dp12e94ejsn9b05f898c79e",
  "X-RapidAPI-Host": "google-news13.p.rapidapi.com",
};

const createRequest = (url) => ({ url, headers: cryptoNewsHeaders });

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://google-news13.p.rapidapi.com",
  }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory }) =>
        createRequest(`/search/suggest?keyword=${newsCategory}&lr=en-US`),
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
