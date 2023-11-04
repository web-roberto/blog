import { getPostsMeta } from "@/lib/posts"
import ListItem from "@/app/components/ListItem"
import Link from "next/link"

export const revalidate = 86400
//export const revalidate = 0
type Props = {
    params: {
        tag: string
    }
}

export async function generateStaticParams() {
    const posts = await getPostsMeta() //deduped!

    if (!posts) return []
    // flat creo que aplana un array de arrays
  //E l método flat() crea una nueva matriz con todos los elementos de sub-array concatenados 
  //recursivamente hasta la profundidad especificada (si no pone nada es 1)). var newArray = arr.flat([depth]);
    const tags = new Set(posts.map(post => post.tags).flat()) //crea un conjunto desde un array de tags que genera
       // el Set es para eliminar los duplicados
    // console.log(Array.from('foo')); output: Array ["f", "o", "o"]. 
    //crea un Array del Set y despues hace un map que crea una key y un valor actual
    return Array.from(tags).map((tag) => ({ tag }))
}

export function generateMetadata({ params: { tag } }: Props) {

    return {
        title: `Posts about ${tag}`
    }
}

export default async function TagPostList({ params: { tag } }: Props) {
    const posts = await getPostsMeta() //deduped!

    if (!posts) return <p className="mt-10 text-center">Sorry, no posts available.</p>

    const tagPosts = posts.filter(post => post.tags.includes(tag))

    if (!tagPosts.length) {
        return (
            <div className="text-center">
                <p className="mt-10">Sorry, no posts for that keyword.</p>
                <Link href="/">Back to Home</Link>
            </div>
        )
    }
   // filtra y muestra todos los posts con el mismo tag
    return (
        <>
            <h2 className="text-3xl mt-4 mb-0">Results for: #{tag}</h2>
            <section className="mt-6 mx-auto max-w-2xl">
                <ul className="w-full list-none p-0">
                    {tagPosts.map(post => (
                        <ListItem key={post.id} post={post} />
                    ))}
                </ul>
            </section>
        </>
    )
}