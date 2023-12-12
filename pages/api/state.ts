import { NextApiRequest, NextApiResponse } from 'next';

interface IState {
    speakerIndex: number,
    running: boolean,
    startTimes: number[]
}

let state: IState = {
    speakerIndex: -1,
    running: false,
    startTimes: []
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(state);
    } else if (req.method === 'PUT') {
        state = req.body;

        if (state.running = false) {
            state.speakerIndex = -1;
            state.startTimes = [];
        } else {
            if (!state.startTimes[state.speakerIndex]) {
                state.startTimes[state.speakerIndex] = Date.now();
            }
        }

        res.status(200).json(state);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};