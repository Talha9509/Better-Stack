import { describe, expect, it } from 'bun:test'

const BACKEND_URL = process.env.BASE_URL
describe("Website gets created", () => {
    it("Website not created if url is not present", async () => {
        await fetch(`${BACKEND_URL}/website`, { method: 'POST' })
        expect(false, "Website created when it shouldn't")

    })

    it("Website created if url is present", async () => {
        const response = await fetch(`${BACKEND_URL}/website`, {
            method: 'POST',
            body: JSON.stringify({
                url: `${BACKEND_URL}`
            })
        })
        const data = await response.json()
        expect(((data as any).id).not.tobeNull(), "Website created when it shouldn't")
    })
})