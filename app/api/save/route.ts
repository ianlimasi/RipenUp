
import type { NextApiRequest, NextApiResponse } from 'next';
import {supabase} from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

type Props = {
    temp: number;
}
export async function Save({temp}: Props) {
    const id = uuidv4();

    const {data, error} = await supabase
    .from('fruits')
    .insert([{
        id: id,
        temp: temp,
        
        
    }]);

}