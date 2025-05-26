import { apiService } from "@/services/api-service"
import fetchMock from "jest-fetch-mock"

// Mock fetch
fetchMock.enableMocks()

describe("ApiService", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("should make a GET request", async () => {
    const mockData = { id: 1, name: "Test" }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const result = await apiService.get("/test")

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/test"), expect.objectContaining({ method: "GET" }))
    expect(result).toEqual(mockData)
  })

  it("should make a POST request", async () => {
    const mockData = { id: 1, name: "Test" }
    const postData = { name: "Test" }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const result = await apiService.post("/test", postData)

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(postData),
      }),
    )
    expect(result).toEqual(mockData)
  })

  it("should make a PUT request", async () => {
    const mockData = { id: 1, name: "Updated Test" }
    const putData = { name: "Updated Test" }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const result = await apiService.put("/test/1", putData)

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/test/1"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(putData),
      }),
    )
    expect(result).toEqual(mockData)
  })

  it("should make a DELETE request", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }))

    const result = await apiService.delete("/test/1")

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/test/1"),
      expect.objectContaining({
        method: "DELETE",
      }),
    )
    expect(result).toEqual({ success: true })
  })

  it("should handle errors", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"))

    await expect(apiService.get("/test")).rejects.toThrow("Network error")
  })

  it("should handle API errors", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: "Not found" }), { status: 404 })

    await expect(apiService.get("/test")).rejects.toThrow("Request failed with status 404")
  })
})
