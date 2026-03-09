import React from 'react';
import Tile from '../Tile';
import { useMovement } from './hooks/useMovement';
import { useResolvedMap } from './hooks/useResolvedMap';


export const Game: React.FC = () => {
    useMovement();
    const resolvedMap = useResolvedMap();

    return <div style={{ display: 'flex', flexDirection: 'row' }}>
        {resolvedMap.map((props) => (
            <Tile {...props} key={props.id} />
        ))}
    </div >
};