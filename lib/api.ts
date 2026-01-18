
import { supabase } from './supabase';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
    description?: string;
    slug?: string;
}

export function getStorageUrl(path: string, bucket: string = 'Crochetty media') {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data || [];
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(limit);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }

    return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        return null;
    }

    return data;
}
