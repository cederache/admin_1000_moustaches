class HostFamilyKind {
    id: number;
    name: string

    static copy(hfk: HostFamilyKind): HostFamilyKind {
        return new HostFamilyKind(hfk.id, hfk.name);
    }

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export default HostFamilyKind;