
from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.websocket.connection_manager import (
    manager
)

router = APIRouter()


@router.websocket("/ws/live-feed")
async def websocket_endpoint(
    websocket: WebSocket
):

    await manager.connect(
        websocket
    )

    try:

        while True:

            data = await websocket.receive_text()

            await manager.broadcast({

                "type": "heartbeat",

                "message": data

            })

    except WebSocketDisconnect:

        manager.disconnect(
            websocket
        )

