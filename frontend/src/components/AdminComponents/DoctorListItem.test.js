import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DoctorListItem from './DoctorListItem';

describe('visual test of the component', () => {
  it('should render without crashing', () => {
    render(<DoctorListItem
      doctor={{ name: 'John', uid: '1234'}}
      setDoctorInfo={(obj) => {}}
      selected={false} 
    />)
  })

  it('should enabled button on not selected', () => {
    const onClick = jest.fn();
    render(<DoctorListItem
      doctor={{ name: 'John', uid: '1234'}}
      setDoctorInfo={onClick}
      selected={false} 
    />);
    
    userEvent.click(screen.getByRole('button', /Select/i));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should disabled button on selected', () => {
    const onClick = jest.fn();
    render(<DoctorListItem
      doctor={{ name: 'John', uid: '1234'}}
      setDoctorInfo={onClick}
      selected={true} 
    />)

    userEvent.click(screen.getByRole('button', /Select/i));
    expect(onClick).not.toHaveBeenCalled();
  });
})