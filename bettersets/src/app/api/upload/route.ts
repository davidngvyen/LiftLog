import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${uuidv4()}${path.extname(file.name)}`

        // In production (Vercel/Netlify), you cannot write to the filesystem like this.
        // You must use an external storage service like Supabase Storage, AWS S3, or Vercel Blob.
        // This implementation is for local development only.

        try {
            await writeFile(
                path.join(process.cwd(), "public/uploads", filename),
                buffer
            )
            return NextResponse.json({
                url: `/uploads/${filename}`,
                success: true
            })
        } catch (error) {
            console.log("Error writing file locally. Check if public/uploads exists.", error)
            return NextResponse.json({ error: "Failed to save file locally." }, { status: 500 })
        }

    } catch (error) {
        console.log("Error occurred ", error)
        return NextResponse.json({ error: "Failed to process request." }, { status: 500 })
    }
}
