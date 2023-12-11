import { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';

let state = {
    speakerIndex: -1
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(state);
    } else if (req.method === 'PUT') {
        state = req.body;
        res.status(200).json(state);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};