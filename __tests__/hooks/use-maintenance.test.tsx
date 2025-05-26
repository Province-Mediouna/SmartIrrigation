import { renderHook, act } from "@testing-library/react-hooks"
import { useMaintenanceTasks } from "@/hooks/use-maintenance"
import { maintenanceService } from "@/services/maintenance-service"

// Mock the maintenance service
jest.mock("@/services/maintenance-service", () => ({
  maintenanceService: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    completeTask: jest.fn(),
    assignTask: jest.fn(),
  },
}))

describe("useMaintenanceTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should fetch maintenance tasks", async () => {
    const mockTasks = {
      data: [
        {
          id: "1",
          title: "Test Task",
          assetType: "station",
          assetId: "123",
          priority: "medium",
          status: "pending",
          dueDate: "2023-05-15T00:00:00Z",
        },
      ],
    }(maintenanceService.getTasks as jest.Mock).mockResolvedValue(mockTasks)

    let result: any
    await act(async () => {
      result = renderHook(() => useMaintenanceTasks()).result
    })

    expect(result.current.tasks).toEqual(mockTasks.data)
    expect(maintenanceService.getTasks).toHaveBeenCalledTimes(1)
  })
})
