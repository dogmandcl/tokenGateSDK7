import {
    engine,
    InputAction,
    MeshCollider,
    MeshRenderer,
    pointerEventsSystem,
    Transform
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import * as utils from '@dcl-sdk/utils'
import { movePlayerTo } from '~system/RestrictedActions'


import { getUserData } from '~system/UserIdentity'



var SCANNING: boolean = false

///ADD WEARABLE URNS HERE

const wearablesToCheck = [
    'urn:decentraland:off-chain:base-avatars:thug_life',
    'urn:decentraland:off-chain:base-avatars:sunglasses',
    'urn:decentraland:off-chain:base-avatars:hat_cap',
    // ...more wearables
];


export function createTokenGate() {




   
    const myCube = engine.addEntity()

    Transform.create(myCube, {
        position: Vector3.create(8, 2, 8),
    })

   

      MeshRenderer.setSphere(myCube)
      MeshCollider.setSphere(myCube)
      


        ///FOR CAMERA ENTER TRIGGER


        // utils.triggers.addTrigger(
        //     scanner,
        //     1,
        //     1,
        //     [{ type: 'box', scale: Vector3.create(2, 4, 3), position: Vector3.create(7, 0, 1) }],
        //     () => {
        //         if (SCANNING) return
        //         SCANNING = true

        //         // check wearables


        //         utils.timers.setTimeout(async () => {
        //             const accepted = await checkWearables(wearablesToCheck)

        //             if (accepted) {

        //                 //   DoorState.getMutable(door).open = true
        //                 //   DoorState.getMutable(door).dirty = true
        //             } else {

        //             }

        //             SCANNING = false
        //         }, 4000)
        //     }
        // )



        ///FOR ONCLICK
    

    

        pointerEventsSystem.onPointerDown(
            {
                entity: myCube,
                opts: {
                    button: InputAction.IA_POINTER,
                    hoverText: 'Check for VIP'
                }
            },
            () => {
                if (SCANNING) return
                SCANNING = true

                // check wearables


                utils.timers.setTimeout(async () => {
                    const accepted = await checkWearables(wearablesToCheck)

                    if (accepted) {
                        movePlayerTo({
                            newRelativePosition: Vector3.create(8, 8, 8)
                            // cameraTarget: Vector3.create(8, 1, 8),
                        })

                        //   DoorState.getMutable(door).open = true
                        //   DoorState.getMutable(door).dirty = true
                    } else {

                    }

                    SCANNING = false
                }, 4000)






            }
        )

        //utils.triggers.enableDebugDraw(true)
    }



export async function checkWearables(filters: string[]) {
    const userData = await getUserData({})

    if (!userData || !userData.data || !userData.data.avatar || !userData.data.avatar.wearables) return false

    console.log('Currently wearing: ', userData.data.avatar)
    let result = false
    for (const filter of filters) {
        if (userData.data.avatar.wearables.includes(filter)) {
            console.log(`User has wearable: ${filter}`);
            return true; // Return true if any of the wearables is found
        }
    }

    console.log('HAS WEARABLE? ', result)
    return result
} 