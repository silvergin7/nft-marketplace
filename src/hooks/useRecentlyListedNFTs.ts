import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { fetchRecentNfts, type NFTQueryResponse } from "@/lib/fetchRecentNfts"
import { filterActiveListings } from "@/utils/filterActiveListings"

export default function useRecentlyListedNFTs() {
    const { data, isLoading, error } = useQuery<NFTQueryResponse>({
        queryKey: ["recentNFTs"],
        queryFn: fetchRecentNfts,
    })

    const nftDataList = useMemo(() => filterActiveListings(data?.data), [data])

    return { isLoading, error, nftDataList }
}
