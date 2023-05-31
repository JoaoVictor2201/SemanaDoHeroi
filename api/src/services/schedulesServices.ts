import { ICreate } from "../interfaces/SchedulesInterface";
import {getHours, isBefore, startOfHour} from 'date-fns'
import { SchedulesRepository } from "../repositories/SchedulesRepository";

class SchedulesServices {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async create({name, phone, date, user_id}: ICreate) {
    
    const dateFormated = new Date(date);
    const hourStart = startOfHour(dateFormated);

    const hour = getHours(hourStart)
    if(hour <= 9 || hour >= 19) {
      throw new Error('O horário de agendamento tem que ser entre as 8h00 e as 18h00')
    }

    if(isBefore(hourStart, new Date())) {
      throw new Error('Não é permitido agendar datas anteriores!')
    }

    const checkIsAvailable = await this.schedulesRepository.find(hourStart, user_id);
    if(checkIsAvailable) {
      throw new Error('Data de agendamento não disponível')
    }
    const create = await this.schedulesRepository.create({
      name, 
      phone, 
      date: hourStart,
      user_id
    });
    return create
  }

  async index(date: Date) {
    const result = await this.schedulesRepository.findAll(date);
    return result;
  }

  async update(id: string, date: Date, user_id: string) {
    const dateFormated = new Date(date);
    const hourStart = startOfHour(dateFormated);

    if(isBefore(hourStart, new Date())) {
      throw new Error('Não é permitido editar para datas anteriores!')
    }

    const checkIsAvailable = await this.schedulesRepository.find(hourStart, user_id);
    if(checkIsAvailable) {
      throw new Error('Data de agendamento não disponível')
    }

    const result = await this.schedulesRepository.update(id, date);
    return result;
  }
}

export {SchedulesServices};