/* Actua como un experto desarrollador Web, debo ahce rel backend con Node.js y el front conr react. Te dare un problema y dame una guia paso a paso de como solucionarlo: una institucion financiera innovadora que busca mejorar la seguridad y eficiencia en la gestion de retiros y depositos bancarios. Nuestro equipo de desarrollo ha sido asignado a un proyecto crucial: crear un sistema seguro y eficiente para gestionar cuentas, validar transacciones y detectar fraudes finacieros. En los ultimos meses, hemos identificado ciertos riesgos en nuestro sistema actual:
-   clientes con cuentas bloquedas debido a intentos excesivos de retiro.
-   Fraudes con transferencias recurrentes entre cuentas sospechosas
-   Uusuarios realizando multiples retiros en segundos, afectando la estabilidad

Para solucionar estos problemas hemos decidido desarrollar una nueva plataforma que a los clientes administrar sus cuentas de manera segura y a la vez nos ayude a detectar patrones sospechosos

mision

construir una api robusta y una interfaz intuitiva para gestionar transacciones bancarias. El sistema debe garantizar:

-   integridad financiera: no se permiten saldos negativos ni transacciones incorrectas.
-   Seguridad transaccional: aplicar reglas que eviten abusos y fraudes
-   deteccion de patrones sospechosos: identificar ciclos en transferencias que puedan indicar lavado de dinero
-   experiencia de usuario fluida: Crear una interfaz web atractiva y funcional para que los clientes gestionen sus cuentas sin complicaciones.



Cuentas:

ID de cuenta, información del cliente, saldo, estado (activa, bloqueada).


Transacciones:

ID, tipo (depósito, retiro, transferencia), monto, fecha y hora, origen y destino (en caso de transferencia).


Logs de seguridad:

Registros de intentos fallidos, bloqueos y alertas de patrones sospechosos.


Consideraciones:

Definir restricciones en la base de datos para prevenir saldos negativos.
Emplear transacciones a nivel de base de datos para garantizar la integridad.
 */

/* 
quiero crear un modelo de transacciones, quiero saber si este codigo es correcto considerando que se debe registrar el origen y destino de una relacion de uno a muchos y estos deben ser cuentasController, y pueden setar vacios, este es mi codigo: // src/models/Role.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import { User } from "./users.js";
import { Status } from "../constants/index.js";
import { Transacciones } from "../constants/transacciones.js";
import { Cuenta } from "./cuentas.js";

export const Transaccion = sequelize.define("transacciones", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [
                    [Transacciones.DEPOSITO, Transacciones.TRANSFERENCIA, Transacciones.RETIRO]
                ],
                msg: "Transaccion solo puede ser deposito, retiro, transferencia",
            },
        },
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'El monto no puede ser negativo'
            },
            notNull: {
                msg: 'Monto no puede ser nulo',
            }
        }
    },
    status: {
        type: DataTypes.STRING(2),
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [
                    [Status.ACTIVE, Status.INACTIVE]
                ],
                msg: "Status solo puede ser active o inactive",
            },
            len: {
                args: [0, 2],
                msg: 'Status debe tener entre 1 y 2 caracteres',
            }
        },
    },
    origen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'cuenta',
            key: 'id',
        },
    },
    destino: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'cuenta',
            key: 'id',
        },
    }
});
//Transaccion.sync();

Cuenta.hasMany(Transaccion, {
    foreignKey: 'origen',
    as: 'transaccion-origen',
});

Transaccion.belongsTo(Cuenta, {
    foreignKey: 'origen',
    as: 'cuenta-origen',
});

Cuenta.hasMany(Transaccion, {
    foreignKey: 'destino',
    as: 'transaccion-destino',
});

Transaccion.belongsTo(Cuenta, {
    foreignKey: 'destino',
    as: 'cuenta-destino',
}); */