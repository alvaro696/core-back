# INTALACION

- primer paso: crear variables de entorno (.env)
    -crear la base de datos ncesaria (solo crearla)

- segundo paso: instalar node modules: npm install

- tercer paso: ejecutar: npm run dev

- cuarto paso: ejecutar: npx sequelize-cli db:seed:all

- quinto paso: crear el usuario admin mediante el siguiente json en la la url: http://localhost:3000/api/users por metodo POST
enviar el siguiente json:
{
  "username":"test",
  "password":"test",
  "roleId":"1",
  "nombres":"test",
  "paterno":"est",
  "materno":"test",
  "cargoId":"1",
  "distritoId":"1",
  "fecha_nacimiento":"2000-01-01"
}
