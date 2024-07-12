import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from 'antd';
import Grid from '../../components/Grid';
import Layout from '../../components/Layout';
import { searchFilter } from '../../utils/searchFilter';
import { Vehicle } from '../../utils/types';
import { listVehicles } from '../../api/vehicle';
const { Search } = Input;
function Vehicles() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await listVehicles();
      setData(data.rows as Vehicle[]);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className='w-full h-full p-8 space-y-4'>
        <div className='flex justify-between'>
          <div>
            <span className='text-2xl mr-3'>主车库</span>
            <span className='text-sm'>共{data.length}个</span>
          </div>
          <div>
            <Search placeholder='搜索名称、备注' allowClear size='large' enterButton='搜索' onSearch={setSearch} />
          </div>
        </div>
        <Grid>
          {data
            .filter((value) => searchFilter(value, search))
            .map((value, index) => {
              return (
                <Link to={`/vehicles/${value.id}`} key={value.id}>
                  <div key={index} className='relative p-2 bg-neutral-200 rounded'>
                    <span className='absolute top-5 left-5 text-white text-lg font-medium'>{`${value.owner.firstName} ${value.owner.lastName}`}</span>
                    <img className='w-full rounded' src={`${value.imageUrl}?type=small`} />
                    <p className='text-lg font-semibold mt-2 truncate text-gray-700'>{value.name}</p>
                    <p className='text-sm text-neutral-500 font-medium'>{value.id}</p>
                  </div>
                </Link>
              );
            })}
        </Grid>
      </div>
    </Layout>
  );
}

export default Vehicles;
