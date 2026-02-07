import { DEV_ACCESS_TOKEN } from "@/api/dev-auth"

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(
    "https://couplemood.ooguy.com/api/Upload",
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${DEV_ACCESS_TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error("Upload image failed")
  }

  const json = await res.json()
  return json.data
}
