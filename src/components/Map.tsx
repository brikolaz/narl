import React from 'react';
import { useRenderedMap } from '../game/hooks/useRenderedMap';
import Tile from './Tile';

export const Map: React.FC = () => {
    const renderedMap = useRenderedMap();

    return renderedMap.map((tile, index) => (
        <Tile renderedTile={tile} key={tile.id} index={index} />
    ))
};