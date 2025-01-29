import { useOthers, useSelf } from "@liveblocks/react/suspense";

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className="flex space-x-4">
      {users.map(({ connectionId, info }) => (
        <Avatar key={connectionId} picture={info.avatar} name={info.name} />
      ))}

      {currentUser && (
        <div className="relative">
          <Avatar
            picture={currentUser.info.avatar}
            name={currentUser.info.name}
          />
        </div>
      )}
    </div>
  );
}

export function Avatar({ picture, name }: { picture: string; name: string }) {
  return (
    <div
      className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shadow-lg"
      data-tooltip={name}
    >
      <img
        alt={name}
        src={picture}
        className="w-full h-full object-cover"
        data-tooltip={name}
      />
    </div>
  );
}
