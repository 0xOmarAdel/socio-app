import Button from '../../ui/Button';
import UserImage from './UserImage';
import UserFullName from './UserFullName';

type Props = {
  image: string;
  fullName: string;
  followers: number;
};

const SuggestedUser: React.FC<Props> = ({ image, fullName, followers }) => {
  return (
    <div className='flex flex-col xl:flex-row items-center gap-2'>
      <UserImage className='w-12 h-12 !mb-0' src={image} alt={fullName} />
      <div className='flex flex-col items-center xl:items-start text-gray-600'>
        <UserFullName className='!text-base font-medium whitespace-nowrap' fullName={fullName} />
        <p className='text-sm whitespace-nowrap'>{followers} followers</p>
        <Button text='Follow' className='!w-fit !h-fit !px-0 !py-0 !bg-transparent !text-sm !text-indigo-700 !rounded-none' />
      </div>
    </div>
  );
};

export default SuggestedUser;