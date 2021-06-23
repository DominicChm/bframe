import {IParticleTypeDefinition, IVariableDefinition} from "../interfaces";
import {end, CType, CTypeEndian, uint8} from "c-type-util";
import {composeStateUpdate, OpCT, parseStateUpdate} from "../../protocol";
import {VarIdCT} from "../../protocol/ctypes/VarIdCT";

type TVar<TState> = IParticleTypeDefinition<TState>["variables"];

type TParserMap = {
    symbol: string,
    cType: CTypeEndian<any>,
    def: IVariableDefinition<any>
}[]


type TSerializerMap<TState> = {
    [k in keyof TState]: {
        varId: number,
        cType: CTypeEndian<any>,
        def: IVariableDefinition<any>
    }
}

type TStateUpdate<TState> = {
    rid: number,
    timestamp: number,
    patch: Partial<TState>,
}

/**
 * A utility class for operating with particle definitions
 */
export class ParticleDef<TState> {
    private readonly _def: IParticleTypeDefinition<TState>;
    private readonly _var: TVar<TState>;

    private readonly _varIDParser: CTypeEndian<number>;
    private readonly _opParser: CTypeEndian<number>;

    //Maps type definition variable indexes to an object containing necessary utilities to parse binary state.
    private readonly _parserInfo: TParserMap;

    //Maps variable (state) keys to objects containing utilities necessary to serialize any given variable
    //in the type definition
    private readonly _serializerInfo: TSerializerMap<TState>;

    public readonly endian: "little" | "big";

    constructor(def: IParticleTypeDefinition<TState>) {
        this._def = def;
        this._var = def.variables;

        this.endian = def.endian;

        //Setup parsers
        this._varIDParser = end(VarIdCT, def.endian);
        this._opParser = end(OpCT, def.endian); //opcode always uint8

        //An array where each index contains the CType and symbol of the variable with that ID.
        this._parserInfo = Object
            .entries<IVariableDefinition<any>>(this._var)
            .map(([k, vDef]) => ({
                symbol: k, //Variable name = key in object
                cType: end(vDef.cType, def.endian), //Grab type from definition
                def: vDef
            }));

        //Creates an object with same keys as state whose values are appropriate CTypes for encoding.
        let s: any = {};
        Object
            .entries<IVariableDefinition<any>>(this._var)
            .forEach(([k, vDef], i) =>
                s[k] = {
                    cType: end(vDef.cType, def.endian),
                    varId: i,
                    def: vDef
                }
            )
        this._serializerInfo = s as TSerializerMap<TState>;

    }

    /**
     * Returns the variable definition that is associated with the passed index or symbol within the loaded type definition
     * @param indexOrSymbol
     */
    varDef(indexOrSymbol: string | number): IVariableDefinition<any> {
        if (typeof indexOrSymbol === "string")
            return this._serializerInfo[indexOrSymbol].def;
        else
            return this._parserInfo[indexOrSymbol].def;
    }

    /**
     * Parses a buffer into a javascript object based on the currently loaded type definition
     * @param buf - The buffer containing a partial data patch. This must have been created to the same spec as the loaded type definition.
     * @param offset - The offset in the buffer at which to begin parsing.
     */
    parseDataPatch(buf: Buffer, offset: number = 0): Partial<TState> {
        const patch: Partial<TState> = {};
        for (let i = offset; i < buf.length; i) {
            //Read variable ID
            const varId: number = this._varIDParser.read(buf, i);
            i += this._varIDParser.size;

            //Find variable def and parser by looking it up with ID as index.
            const {symbol, cType, def} = this._parserInfo[varId];

            if (!def)
                throw new Error(`Variable ID >${varId}< not found on particle type >${this._def.typeName}<!!!`);

            //Parse and apply the new data to the temporary patch object.
            patch[symbol] = cType.read(buf, i);
            i += cType.size;
        }

        return patch;
    }

    /**
     * Takes a javascript object (that matches the current typedef) and serializes it to a buffer.
     * ONLY SERIALIZES FIELDS THAT ARE OWNED BY THE SERVER!!!!!!!!!!!
     * @param patch
     * @param offset
     */
    serializeDataPatch(patch: Partial<TState>, offset: number = 0): Buffer {
        const parts: Buffer[] = [];

        for (let k in patch) {
            //Find variable def and parser by looking it up with ID as index.
            const {varId, cType, def} = this._serializerInfo[k];

            // Only serialize server state.
            if (def.owner !== "server") continue;

            //Push the variable ID
            parts.push(this._varIDParser.alloc(varId))

            //Push the serialized data
            parts.push(cType.alloc(patch[k]));
        }

        return Buffer.concat(parts);
    }

    parseOp(data: Buffer, offset: number = 0) {
        return this._opParser.read(data, offset);
    }

    /**
     * Deserializes a state update packet into an object, according to this object's loaded type definition
     * @param buf
     * @param offset
     */
    parseStateUpdate(buf: Buffer, offset: number = 0): TStateUpdate<TState> {
        const {data, rid, timestamp} = parseStateUpdate(buf, this.endian);
        const patch = this.parseDataPatch(data);
        return {
            rid,
            timestamp,
            patch,
        }
    }

    /**
     * Composes a full state update packet from the passed patch
     * @param patch - The patch to serialize
     */
    composeStateUpdate(patch: Partial<TState>): Buffer {
        const data = this.serializeDataPatch(patch);
        return composeStateUpdate(data, this.endian);
    }
}
