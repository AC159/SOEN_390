const getNotification = jest.fn()

const addNewNotification = jest.fn()

const deleteNotification = jest.fn()

const mockNotificationRepository = jest.fn().mockImplementation(() => {
    return {
        getNotification: getNotification,
        addNewNotification: addNewNotification,
        deleteNotification: deleteNotification
    };
})

module.exports = mockNotificationRepository;