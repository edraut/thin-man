var TestResponses = {
    success: {
        status: 200,
        responseText: '{"flash_message": "successfully response", "flash_persist": false}'
    },
    error: {
        status: 500,
        responseText: '{"flash_message": "error response", "flash_persist": false}'
    },
    conflict: {
        status: 409,
        responseText: '{"flash_message": "conflict response", "flash_persist": false, "html": "Required field"}'
    },
    conflictNoHtml: {
        status: 409,
        responseText: '{"flash_message": "conflict response", "flash_persist": false}'
    },
    conflictString: {
        status: 409,
        responseText: 'conflict string response'
    }
};