'use server';

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSnippet(formState: { message: string }, formData: FormData) {
    try {
        // Check the user's inputs and make sure they're valid
        const title = formData.get('title') as string;
        const code = formData.get('code') as string;

        if (typeof title !== 'string' || title.length < 3) {
            return {
                message: 'Tile must be longer',
            }
        }
        
        if (typeof code !== 'string' || code.length < 10) {
            return {
                message: 'Code must be longer',
            }
        }

        // Create a new record in the db
        await db.snippet.create({
            data: {
                title,
                code
            }
        })
       
    } catch(error: unknown) {
        if (error instanceof Error) {
            return {
                message: error.message
            }
        } else {
            return {
                message: 'Something went wrong...',
            }
        }
    }
   
    // revalidate home page route
    revalidatePath('/');
    // Redirect the user back to the root route
    redirect('/');
}

export async function editSnippet(id: number, code: string) {
    console.log(id, code);
    await db.snippet.update({
        where: { id },
        data: { code }
    });

    // revalidate home page route
    revalidatePath('/');
    revalidatePath(`/snippets/${id}`);
    redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
    await db.snippet.delete({
        where: { id }
    });

    // revalidate home page route
    revalidatePath('/');
    redirect('/');
}