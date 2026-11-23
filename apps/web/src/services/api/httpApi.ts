import { meToDomain } from '@/adapters/auth.adapter';
import {
  buildingToDomain,
  catalogOptionToDomain,
  organizationToDomain,
  roleToDomain,
  roleWithCategoryToDomain,
  themeToDomain,
  venueWithBuildingToDomain,
} from '@/adapters/catalog.adapter';
import {
  formDetailToDomain,
  formDraftToContract,
  formToDomain,
} from '@/adapters/forms.adapter';
import {
  studentsListItemToDomain,
  studentToDomain,
} from '@/adapters/students.adapter';
import { AuthApi } from '@/api/AuthApi';
import { CatalogApi } from '@/api/CatalogApi';
import { FilesApi } from '@/api/FilesApi';
import { FormsApi } from '@/api/FormsApi';
import { StudentsApi } from '@/api/StudentsApi';
import { Building } from '@/types/building';
import { CatalogOption, Organization, Theme } from '@/types/catalog';
import { FormDetail } from '@/types/form-detail';
import { FormDraft } from '@/types/form-draft';
import { FormsListItem } from '@/types/forms-list';
import { Role } from '@/types/role';
import { RoleCategory } from '@/types/role-category';
import { RoleWithCategory } from '@/types/role-with-category';
import { Student, StudentSummary } from '@/types/student';
import { Me } from '@/types/user';
import { VenueWithBuilding } from '@/types/venue-with-building';
import { EventsApi, ListEventsQuery } from '@/api/EventsApi';
import { EventsList } from '@/types/events-list';
import { eventsListItemToDomain } from '@/adapters/events.adapter';

const authApi = new AuthApi();
const formsApi = new FormsApi();
const catalogApi = new CatalogApi();
const studentsApi = new StudentsApi();
const filesApi = new FilesApi();
const eventsApi = new EventsApi();

export const httpApi = {
  async getMe(): Promise<Me> {
    const me = await authApi.getMe();
    return meToDomain(me);
  },

  async logout(): Promise<void> {
    await authApi.logout();
  },

  async getFormsList(): Promise<FormsListItem[]> {
    const forms = await formsApi.getFormsList();
    return forms.map(formToDomain);
  },

  async createForm(draft: FormDraft): Promise<string> {
    const response = await formsApi.createForm(formDraftToContract(draft));
    return response.formId;
  },

  async getForm(id: string): Promise<FormDetail> {
    return formDetailToDomain(await formsApi.getForm(id));
  },

  async updateForm(id: string, draft: FormDraft): Promise<FormDetail> {
    return formDetailToDomain(
      await formsApi.updateForm(id, formDraftToContract(draft)),
    );
  },

  async generateFormDocument(id: string): Promise<string> {
    const response = await formsApi.generateDocument(id);
    return response.fileId;
  },

  async attachFormDocument(id: string, fileId: string): Promise<void> {
    await formsApi.attachDocument(id, fileId);
  },

  async uploadFile(file: File): Promise<string> {
    const response = await filesApi.upload(file);
    return response.fileId;
  },

  async markFormReady(id: string): Promise<void> {
    await formsApi.markReady(id);
  },

  async convertFormToDraft(id: string, reason: string | null): Promise<void> {
    await formsApi.convertToDraft(id, reason);
  },

  async cancelForm(id: string): Promise<void> {
    await formsApi.cancel(id);
  },

  async cancelFormReview(id: string): Promise<void> {
    await formsApi.cancelReview(id);
  },

  async startFormReview(id: string): Promise<void> {
    await formsApi.startReview(id);
  },

  async approveForm(id: string): Promise<void> {
    await formsApi.approve(id);
  },

  async rejectForm(id: string, reason: string | null): Promise<void> {
    await formsApi.reject(id, reason);
  },

  async getThemes(): Promise<Theme[]> {
    const themes = await catalogApi.getThemes();
    return themes.map(themeToDomain);
  },

  async getOrganizations(): Promise<Organization[]> {
    const organizations = await catalogApi.getOrganizations();
    return organizations.map(organizationToDomain);
  },

  async getBuildings(): Promise<Building[]> {
    const buildings = await catalogApi.getBuildings();
    return buildings.map(buildingToDomain);
  },

  async getBuildingVenues(buildingId: string): Promise<VenueWithBuilding[]> {
    const venues = await catalogApi.getBuildingVenues(buildingId);
    return venues.map(venueWithBuildingToDomain);
  },

  async getLevels(): Promise<CatalogOption[]> {
    const levels = await catalogApi.getLevels();
    return levels.map(catalogOptionToDomain);
  },

  async getFormats(): Promise<CatalogOption[]> {
    const formats = await catalogApi.getFormats();
    return formats.map(catalogOptionToDomain);
  },

  async getEventTypes(): Promise<CatalogOption[]> {
    const types = await catalogApi.getEventTypes();
    return types.map(catalogOptionToDomain);
  },

  async getRoleCategories(): Promise<RoleCategory[]> {
    const categories = await catalogApi.getRoleCategories();
    return categories.map(catalogOptionToDomain);
  },

  async getCategoryRoles(categoryId: string): Promise<Role[]> {
    const roles = await catalogApi.getCategoryRoles(categoryId);
    return roles.map(roleToDomain);
  },

  async getStudents(): Promise<StudentSummary[]> {
    const students = await studentsApi.getStudentsList();
    return students.map(studentsListItemToDomain);
  },

  async getStudent(studentId: string): Promise<Student> {
    const student = await studentsApi.getStudent(studentId);
    return studentToDomain(student);
  },

  async resolveVenues(ids: string[]): Promise<VenueWithBuilding[]> {
    const venues = await catalogApi.resolveVenues(ids);
    return venues.map(venueWithBuildingToDomain);
  },

  async resolveRoles(ids: string[]): Promise<RoleWithCategory[]> {
    const roles = await catalogApi.resolveRoles(ids);
    return roles.map(roleWithCategoryToDomain);
  },

  async listEvents(query: ListEventsQuery): Promise<EventsList> {
    const events = await eventsApi.listEvents(query);
    return events.map(eventsListItemToDomain);
  }
};
