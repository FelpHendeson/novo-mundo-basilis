import {describe,it,expect} from 'vitest';
import {makeUnits,reachable,damage,TECHNIQUES,dist} from '../src/game/model';
describe('modelo tático',()=>{
 it('cria aliados e inimigos',()=>{const u=makeUnits('Kael','Mago');expect(u[0].name).toBe('Kael');expect(u[0].cls).toBe('Mago');expect(u.filter(x=>x.team==='enemy')).toHaveLength(2);});
 it('bloqueia rochas e ocupação',()=>{const u=makeUnits();const r=reachable(u[0],u);expect(r.has('1,5')).toBe(false);expect(r.has('1,6')).toBe(false);expect(r.has('1,4')).toBe(true);});
 it('garante pelo menos um de dano',()=>{const u=makeUnits();u[2].defense=999;expect(damage(u[0],u[2],TECHNIQUES.Guerreiro[0])).toBe(1);});
 it('calcula distância Manhattan',()=>expect(dist({x:1,y:1},{x:4,y:5})).toBe(7));
});
