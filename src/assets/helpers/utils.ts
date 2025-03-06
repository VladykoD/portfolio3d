import { Mesh } from 'three';
// @ts-ignore
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';

export function setupGUI(object: Mesh, name: string) {
  const gui = new GUI();

  const newFolder = gui.addFolder(name + ' folder');
  const positionFolder = newFolder.addFolder(name);
  positionFolder.add(object.position, 'x', -50, 50);
  positionFolder.add(object.position, 'y', -50, 50);
  positionFolder.add(object.position, 'z', -150, 150);
}
