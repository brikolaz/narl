import React from 'react';
import Tile from './Tile';
import { useRenderedMap } from '../game/hooks/useRenderedMap';
import { useKeyboardControls } from '../game/hooks/useKeyboardControls';


export const Game: React.FC = () => {
    useKeyboardControls();
    const renderedMap = useRenderedMap();

    return <div style={{ display: 'flex', flexDirection: 'row' }}>
        {renderedMap.map((tile) => (
            <Tile renderedTile={tile} key={tile.id} />
        ))}
    </div >
};