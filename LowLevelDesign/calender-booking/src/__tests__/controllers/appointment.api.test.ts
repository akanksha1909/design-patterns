import request from "supertest";
import app from '../../app.js';

describe("Appointment API", () => {
    it("POST API should create an appointment", async () => {
        const response = await request(app).post("/appointments").
            send({
                hostId: "1",
                guestId: "2",
                timezone: "Asia/Kolkata",
                startTime: "2025-12-02T10:00",
                durationInMins: 30,
            });

        expect(response.status).toBe(201);
    });

    it("GET API to list appointments", async () => {
        const res = await request(app).get("/appointments").query({ hostId: "1" });
        expect(res.status).toBe(200);
    });

    it("GET API should fail without hostId", async () => {
        const res = await request(app).get("/appointments");
        expect(res.status).toBe(400);
    });
});