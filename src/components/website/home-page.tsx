import React from 'react'
import { Hero } from './Common/hero'
import { CategoryGrid } from '@/features/category-page/components/category-grid'
import { Features } from '@/features/category-page/components/features'
import { FAQ } from './Common/faq'

export default function HomePage() {
  return (
    <>
        <Hero/>
        <CategoryGrid/>
        <Features/>
        <FAQ/>
    </>
  )
}
