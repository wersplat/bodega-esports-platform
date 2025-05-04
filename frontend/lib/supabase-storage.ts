import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${uuidv4()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, file, { upsert: true })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from("profiles").getPublicUrl(filePath)
    return data.publicUrl
  } catch (error) {
    // console.error("Error uploading avatar:", error)
    return null
  }
}

export async function deleteAvatar(avatarUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlParts = avatarUrl.split("/")
    const filePath = `avatars/${urlParts[urlParts.length - 1]}`

    const { error } = await supabase.storage.from("profiles").remove([filePath])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    // console.error("Error deleting avatar:", error)
    return false
  }
} 