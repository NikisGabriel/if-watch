import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ReactComponent as PersonIcon } from "../../assets/icons/person.svg";
import { ReactComponent as DropIcon } from "../../assets/icons/drop.svg";
import { ReactComponent as HighThermometerIcon } from "../../assets/icons/highThermometer.svg";
import { ReactComponent as LightIcon } from "../../assets/icons/light.svg";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus.svg";

import * as S from "./styles";

import roomContext from "../../contexts/roomContext";

import { Text } from "../../components/Text";
import { Icon } from "../../components/Icon";
import { IRoomInfoModel } from "../../models/roomInfo.model";
import { useListener } from "../../hooks/useListener";
import { Button } from "../../components/Button";
import { LetterAnimation } from "../../components/LetterAnimation";
import { IRoomModel } from "../../models/room.model";
import { useRemoveData } from "../../hooks/useRemoveData";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { electronicTypesEnum } from "../../enums/electronicTypes.enum";
import { ICreateElectronicModel } from "../../models/electronic.model";
import { useSetData } from "../../hooks/useSetData";
import { IAirConditioningModel } from "../../models/airConditioning.model";
import { ITelevisionModel } from "../../models/television.model copy";

const electronicTypesOptions = Object.keys(electronicTypesEnum).map((key) => ({
  value: key,
  text: electronicTypesEnum[key as keyof typeof electronicTypesEnum],
}));

const BASE: ICreateElectronicModel & {
  type: keyof typeof electronicTypesEnum;
} = {
  name: "",
  type: "airConditioning",
};

function Room() {
  const [createElectronicModalOpen, setCreateElectronicModalOpen] =
    useState(false);
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState<IRoomInfoModel | null>(null);
  const [room, setRoom] = useState<IRoomModel | null>(null);
  const { getRoom, rooms } = useContext(roomContext);
  const [newElectronic, setNewElectronic] = useState<typeof BASE>(BASE);
  const invalidSubmit = !newElectronic.name || !newElectronic.type;

  // IMPORTANTE
  const navigate = useNavigate();

  // Buscando a sala quando
  useEffect(() => {
    if (!roomId || !rooms) return;

    setRoom(getRoom(roomId));
  }, [roomId, rooms]);

  // Listener para buscar as info relacionadas a salas
  useListener<IRoomInfoModel>(
    {
      path: "roomsInfo/" + (room ? room.roomInfoId : ""),
      eventType: "changed",
      useEffectTrigger: [room],
      addListener: !!room,
    },
    (data) => setRoomInfo(data),
    (error) => {
      throw error;
    }
  );

  const handleRoomDelete = async () => {
    if (!room) return;
    await useRemoveData("roomsInfo/" + room.roomInfoId, (error) => {
      throw error;
    });
    await useRemoveData("rooms/" + room.id, (error) => {
      throw error;
    });
    navigate(
      rooms && rooms.length >= 2
        ? "/room/" + (rooms[0].id !== room.id ? rooms[0].id : rooms[1].id)
        : "/"
    );
  };

  const handleCreateElectronic = async () => {
    if (!room) return;
    switch (newElectronic.type) {
      case "airConditioning": {
        return await useSetData<IAirConditioningModel>(
          "electronics",
          (dataRef) => {
            return {
              ...newElectronic,
              id: dataRef,
              roomId: room.id,
              temperature: 16,
              online: false,
            };
          },
          (error) => {
            throw error;
          }
        );
      }
      case "television": {
        return await useSetData<ITelevisionModel>(
          "electronics",
          (dataRef) => {
            return {
              ...newElectronic,
              id: dataRef,
              roomId: room.id,
              online: false,
            };
          },
          (error) => {
            throw error;
          }
        );
      }
      default: {
        throw new Error("Esse tipo de eletrônico não existe");
      }
    }
  };

  return (
    <S.Container className={`${!roomInfo && "isLoading"}`}>
      {!room && !roomInfo && <LetterAnimation text="Loading..." />}
      {room && roomInfo && (
        <>
          <header>
            <div className="name-container">
              <Text is="h2" size="big" lineLimit={1}>
                {room.name}
              </Text>
              <Button
                onClick={handleRoomDelete}
                title="Deletar sala"
                role="button"
                shape="squared"
                size="small"
                variant="transparent"
              >
                <Icon icon={<TrashIcon />} />
              </Button>
            </div>
            <div className="icon-container">
              <span>
                <Icon icon={<PersonIcon />} />
                <Text is="h2" size="big">
                  {roomInfo.amountOfPeople}
                </Text>
              </span>
              <span>
                <Icon icon={<LightIcon />} />
                <Text is="h2" size="big">
                  {roomInfo.luminosity}%
                </Text>
              </span>
              <span>
                <Icon icon={<DropIcon />} />
                <Text is="h2" size="big">
                  {roomInfo.moisture}%
                </Text>
              </span>
              <span>
                <Icon icon={<HighThermometerIcon />} />
                <Text is="h2" size="big">
                  {roomInfo.temperature}°
                </Text>
              </span>
            </div>
          </header>
          <aside>
            <Button
              onClick={() => setCreateElectronicModalOpen(true)}
              title="Adicionar eletrônico a sala"
              role="button"
              shape="squared"
              aria-expanded={createElectronicModalOpen}
            >
              <Icon icon={<PlusIcon />} />
            </Button>
          </aside>
          <Modal
            title="Criar novo eletrônico"
            open={createElectronicModalOpen}
            onClose={() => setCreateElectronicModalOpen(false)}
          >
            <form>
              <div>
                <Input
                  type="text"
                  aria-autocomplete="list"
                  spellCheck={true}
                  aria-label="Digite o nome do eletrônico"
                  placeholder="Nome do eletrônico"
                  error={!newElectronic.name}
                  onChange={(e) =>
                    setNewElectronic((room) => ({
                      ...room,
                      name: e.target.value,
                    }))
                  }
                />
                <Select
                  options={electronicTypesOptions}
                  defaultValue={newElectronic.type}
                  aria-autocomplete="list"
                  spellCheck={true}
                  aria-label="Escolha o tipo da eletrônico"
                  onChange={(e) =>
                    setNewElectronic((room) => ({
                      ...room,
                      type: e.target.value as (typeof BASE)["type"],
                    }))
                  }
                />
              </div>
              <Button
                title="Criar eletrônico"
                role="button"
                shape="full"
                size="base"
                disabled={invalidSubmit}
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateElectronic();
                }}
              >
                <Text is="h2">Criar Eletrônico</Text>
                <Icon size="small" icon={<PlusIcon />} />
              </Button>
            </form>
          </Modal>
        </>
      )}
    </S.Container>
  );
}

export { Room };
