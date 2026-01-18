
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function test() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(5);

        if (error) {
            console.error("❌ Error:", error.message);
        } else {
            console.log("✅ Data sample:");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("❌ Unexpected error:", err);
    }
}

test();
