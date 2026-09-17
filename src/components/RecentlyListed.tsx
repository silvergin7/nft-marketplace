import Link from "next/link"
import NFTBox from "./NFTBox"
import useRecentlyListedNFTs from "../hooks/useRecentlyListedNFTs"

export default function RecentlyListedNFTs() {
    const { isLoading, error, nftDataList } = useRecentlyListedNFTs()

    if (isLoading) {
        return <div>Loading recently listed NFTs...</div>
    }

    if (error) {
        console.error("Error fetching NFTs:", error)
        return <div>Error loading NFTs. Please try again later.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-8 text-center">
                <Link
                    href="/list-nft"
                    className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    List Your NFT
                </Link>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Recently Listed</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {nftDataList && nftDataList.length > 0 ? (
                    nftDataList.map(nft => (
                        <Link
                            href={`/buy-nft/${nft.contractAddress}/${nft.tokenId}`}
                            key={`${nft.contractAddress}-${nft.tokenId}-link`}
                        >
                            <NFTBox
                                key={`${nft.contractAddress}-${nft.tokenId}`}
                                tokenId={nft.tokenId}
                                contractAddress={nft.contractAddress}
                                price={nft.price}
                            />
                        </Link>
                    ))
                ) : (
                    !isLoading && <div>No active NFT listings found.</div>
                )}
            </div>
        </div>
    )
}
