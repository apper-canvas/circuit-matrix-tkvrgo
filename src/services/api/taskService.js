const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "due_date"
            }
          },
          {
            field: {
              Name: "priority"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "completed_at"
            }
          },
          {
            field: {
              Name: "farm_id"
            }
          },
          {
            field: {
              Name: "crop_id"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "due_date"
            }
          },
          {
            field: {
              Name: "priority"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "completed_at"
            }
          },
          {
            field: {
              Name: "farm_id"
            }
          },
          {
            field: {
              Name: "crop_id"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async getByFarmId(farmId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "due_date"
            }
          },
          {
            field: {
              Name: "farm_id"
            }
          }
        ],
        where: [
          {
            FieldName: "farm_id",
            Operator: "EqualTo",
            Values: [parseInt(farmId, 10)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks for farm ${farmId}:`, error);
      throw error;
    }
  },

  async getTodaysTasks() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          {
            field: {
              Name: "title"
            }
          },
          {
            field: {
              Name: "description"
            }
          },
          {
            field: {
              Name: "due_date"
            }
          },
          {
            field: {
              Name: "priority"
            }
          },
          {
            field: {
              Name: "status"
            }
          },
          {
            field: {
              Name: "farm_id"
            }
          },
          {
            field: {
              Name: "crop_id"
            }
          }
        ],
        where: [
          {
            FieldName: "due_date",
            Operator: "ExactMatch",
            SubOperator: "Day",
            Values: [`${new Date().getDate()} ${new Date().toLocaleDateString('en', { month: 'short' })} ${new Date().getFullYear()}`]
          },
          {
            FieldName: "status",
            Operator: "NotEqualTo",
            Values: ["Completed"]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const recordData = {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        farm_id: parseInt(taskData.farmId, 10)
      };
      
      if (taskData.cropId) {
        recordData.crop_id = parseInt(taskData.cropId, 10);
      }
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id, 10)
      };
      
      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title = taskData.title;
      }
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate;
      if (taskData.priority !== undefined) updateData.priority = taskData.priority;
      if (taskData.status !== undefined) {
        updateData.status = taskData.status;
        if (taskData.status === 'Completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }
      if (taskData.farmId !== undefined) updateData.farm_id = parseInt(taskData.farmId, 10);
      if (taskData.cropId !== undefined) {
        updateData.crop_id = taskData.cropId ? parseInt(taskData.cropId, 10) : null;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update task');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete task');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};

export default taskService;