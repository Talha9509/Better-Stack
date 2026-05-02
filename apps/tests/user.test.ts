
import { describe, expect, it, test } from "bun:test";

const BACKEND_URL = process.env.BASE_URL
const USER_NAME = Math.random().toString();

describe("Signup endpoints", () => {
    it("Isnt able to sign up if body is incorrect", async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/user/signup`, {
                method: 'POST',
                body: JSON.stringify({
                    email: USER_NAME,
                    password: "password"
                })
            })
            await response.json()
            expect(false, "Control shouldnt reach here")
        } catch (error) {
            console.log(error)
        }
    })

    it("Is able to sign up if body is incorrect", async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/user/signup`, {
                method: 'POST',
                body: JSON.stringify({
                    email: USER_NAME,
                    password: "password"
                })
            })
            const data = await response.json()
            expect((data as any).status).toBe(200);
            expect((data as any).data.id).toBeDefined();
        } catch (e) {
            console.log(e);
        }
    })
})


describe("Signin endpoints", () => {
    it("Isnt able to sign in if body is incorrect", async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/user/signin`, {
                method: 'POST',
                body: JSON.stringify({
                    email: USER_NAME,
                    password: "password"
                })
            })
            await response.json()
            expect(false, "Control shouldnt reach here")
        } catch (e) {
            console.log(e);
        }
    })

    it("Is able to sign in if body is incorrect", async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/user/signin`, {
                method: 'POST',
                body: JSON.stringify({
                    email: USER_NAME,
                    password: "password"
                })
            })
            const data = await response.json()
            expect((data as any).status).toBe(200);
            expect((data as any).data.jwt).toBeDefined();
        } catch (e) {
            console.log(e);
        }
    })
})