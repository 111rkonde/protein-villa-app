import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { GoalSelector } from '../components/home/GoalSelector';
import { BestSellers } from '../components/home/BestSellers';
import { WhyUsSection } from '../components/home/WhyUsSection';
import { StackBuilderPreview } from '../components/home/StackBuilderPreview';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { productService } from '../services/product.service';
import { Category, Product } from '../types';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ sortBy: 'popular', limit: 8 }),
        ]);
        setCategories(cats);
        setProducts(prods.data || []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturedCategories categories={categories} />
      <GoalSelector />
      <BestSellers products={products} />
      <StackBuilderPreview />
      <WhyUsSection />
      <TestimonialsSection />
    </div>
  );
};
