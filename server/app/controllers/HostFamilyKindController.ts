import { AppDataSource } from "../config/database";
import { HostFamilyKind } from "../models/HostFamilyKind";

export class HostFamilyKindController {
  private hostFamilyKindRepository =
    AppDataSource.getRepository(HostFamilyKind);

  async getAllHostFamilyKinds() {
    return await this.hostFamilyKindRepository.find({
      relations: {
        hostFamilies: false,
        species: true,
      },
    });
  }

  async getHostFamilyKindById(id: number) {
    return await this.hostFamilyKindRepository.findOne({
      where: { id },
      relations: {
        hostFamilies: false,
        species: true,
      },
    });
  }

  async createHostFamilyKind(kindData: Partial<HostFamilyKind>) {
    const kind = this.hostFamilyKindRepository.create(kindData);
    return await this.hostFamilyKindRepository.save(kind);
  }

  async updateHostFamilyKind(id: number, kindData: Partial<HostFamilyKind>) {
    await this.hostFamilyKindRepository.update(id, kindData);
    return await this.getHostFamilyKindById(id);
  }

  async deleteHostFamilyKind(id: number) {
    return await this.hostFamilyKindRepository.delete(id);
  }
}
