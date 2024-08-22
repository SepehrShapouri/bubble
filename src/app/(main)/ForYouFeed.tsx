"use client"
import { getPosts } from '@/components/main/actions'
import { PostData } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function ForYouFeed() {
    const {data,isLoading} = useQuery<PostData[]>({
        queryKey:['post-feed','for-you-feed'],
        queryFn:async()=>await getPosts()
    })
    console.log(data)
  return (
    <div>ForYouFeed</div>
  )
}

export default ForYouFeed