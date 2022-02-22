const getNotification = jest.fn();

const addNewNotification = jest.fn();

const deleteNotification = jest.fn();

const addManyNotifications = jest.fn();

const mockNotificationRepository = jest.fn().mockImplementation(() => {
    return {
        getNotification: getNotification,
        addNewNotification: addNewNotification,
        deleteNotification: deleteNotification,
        addManyNotifications: addManyNotifications
    };
})

module.exports = mockNotificationRepository;